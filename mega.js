const fs = require("fs")
const { Storage } = require("megajs")
require("dotenv").config()

const email = process.env.MEGA_EMAIL
const password = process.env.MEGA_PASSWORD
const SESSION_FILE = "./session/creds.json"

async function uploadSession() {
    if (!fs.existsSync(SESSION_FILE)) return
    const storage = await new Storage({ email, password }).ready
    let file = await storage.upload("infinity-session.json", fs.readFileSync(SESSION_FILE))
    await file.complete
    console.log("✅ Session upload to MEGA")
}

async function downloadSession() {
    const storage = await new Storage({ email, password }).ready
    const file = storage.root.children.find(f => f.name === "infinity-session.json")
    if (!file) return
    const buffer = await file.downloadBuffer()
    fs.mkdirSync("./session", { recursive: true })
    fs.writeFileSync(SESSION_FILE, buffer)
    console.log("✅ Session downloaded from MEGA")
}

module.exports = { uploadSession, downloadSession }
