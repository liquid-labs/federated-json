# federated-json

Library that builds a single JSON object from multiple JSON files.

## Install

```
npm i @liquid-labs/federated-json
```

## Usage

Example from `src/lib/test/example.js`:
```javascript
import * as fjson from '../federated-json'

const data = {
  "foo": {
    "bar": {
      "baz": { "field1": "val1", "field2": "val2" }
    }
  }
}

fjson.addMountPoint({ data, path: '.foo.bar', file: './data-foo-bar.json' })
// atm it's necessary to move the data pointer under the previous mount
// It won't work now, but future versions will support:
// fjson.addMountPoint({ data, path: 'foo.bar.baz', file: './data-foo-bar-baz.json' })
fjson.addMountPoint({ data: data.foo.bar, path: '.baz', file: './data-foo-bar-baz.json' })

fjson.write({ data, filePath: `./data.json` })
// There are now three files; the root data and the two mount point files.

// by default, returns a single object which has the data and '_meta' elements combined
const dataWithMeta = fjson.read('./data.json')
console.log(JSON.stringify(dataWithMeta, null, 2))
const [ data, metaData ] fjson.read('./data.json', { splitMeta : true })
console.log(JSON.stringify(data, null, 2))
console.log(JSON.stringify(metaData, null, 2))
```

