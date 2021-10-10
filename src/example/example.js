import * as fjson from '../lib/federated-json'

const data = {
  "foo": {
    "bar": {
      "baz": { "field1": "val1", "field2": "val2" }
    }
  }
}

fjson.addMountPoint({ data, path: '.foo.bar', file: './data-foo-bar.json' })
// atm it's necessary to move the data pointer immediately under the previous mount
// It won't work now, but future versions will support:
// fjson.addMountPoint({ data, path: 'foo.bar.baz', file: './data-foo-bar-baz.json' })
fjson.addMountPoint({ data: data.foo.bar, path: '.baz', file: './data-foo-bar-baz.json' })

fjson.write({ data, file: `./data.json` })
// There are now three files; the root data and the two mount point files.

// by default, returns a single object which has the data and '_meta' elements combined
const dataWithMeta = fjson.read('./data.json')
console.log("With embedded meta-data:\n", JSON.stringify(dataWithMeta, null, 2))
const [ dataOnly, metaData ] = fjson.read('./data.json', { separateMeta : true })
console.log("\nSeparate meta-data:\n", JSON.stringify(metaData, null, 2))
console.log("\nSeparate data:\n", JSON.stringify(dataOnly, null, 2))
