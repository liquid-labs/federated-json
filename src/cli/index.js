import * as fjson from '../fjson/federated-json'

const rootFile = process.argv[2]

console.log(JSON.stringify(fjson.read(rootFile), null, 2))
