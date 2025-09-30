const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const Pino = require("pino")
const { uploadSession, downloadSession } = require("./mega")

async function startBot() {
    await downloadSession()

    const { state, saveCreds } = await useMultiFileAuthState("./session")

    const sock = makeWASocket({
        logger: Pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on("creds.update", async () => {
        await saveCreds()
        await uploadSession()
    })

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return

        // Reponn kòmand yo
        await handleCommands(sock, from, text)
    })
}

async function handleCommands(sock, from, text) {
    const cmd = text.trim().toLowerCase()

    switch(cmd) {
        case "ping":
            await sock.sendMessage(from, { text: "pong 🏓" })
            break
        case ".menu":
        case ".help":
            await sock.sendMessage(from, { text:
`📜 *INFINITY-MD Bot Menu* 📜
🟢 ping - teste bot la
🟢 .menu / .help - montre meni sa
🟢 .owner - montre pwopriyetè bot la
🟢 .about - enfòmasyon sou bot la
Powered by SIRIUS ✅`})
            break
        case ".owner":
            await sock.sendMessage(from, { text: "👑 Bot Owner: SIRIUS" })
            break
        case ".about":
            await sock.sendMessage(from, { text: "🤖 INFINITY-MD WhatsApp Bot\nVersion: 1.0.0\nPowered by SIRIUS" })
            break
        default:
            // Optional: ou ka voye mesaj si kòmand pa rekonèt
            // await sock.sendMessage(from, { text: "Kòmand pa rekonèt, itilize .menu pou wè lis kòmand yo." })
            break
    }
}

startBot()
