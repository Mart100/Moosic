module.exports = (handleMessage) => {

  process.stdin.on('readable', () => {
    let input:any= []
    let chunk
    while (chunk = process.stdin.read()) {
      input.push(chunk)
    }
    input = Buffer.concat(input)

    let msgLen = input.readUInt32LE(0)
    let dataLen = msgLen + 4

    if (input.length >= dataLen) {
      let content = input.slice(4, dataLen)
      let json = JSON.parse(content.toString())
      handleMessage(json)
    }
  })

  function sendMessage (msg) {
    let buffer = Buffer.from(JSON.stringify(msg))

    let header = Buffer.alloc(4)
    header.writeUInt32LE(buffer.length, 0)

    let data = Buffer.concat([header, buffer])
    process.stdout.write(data)
  }

  process.on('uncaughtException', (err) => {
    sendMessage({error: err.toString()})
  })

  return sendMessage

}