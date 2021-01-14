# federated-json

Library that builds a single JSON object from multiple JSON files.

## Install

```
npm i @liquid-labs/federated-json
```

## Usage

_*WARNING: this usage is partially speculative. The library interface has not yet settled.*_

* `data.json`:
   ```json
{
  "foo": {
    "bar": {
      "baz": { "field1": "val1", "field2": "val2" }
    }
  }
}
```
* `example.js`:
   ```javascript
import * as fjson from '@liquid-labs/federated-json'

const data = fjson.readFJSON('./data.json')

fjson.addMountPoint(data, 'foo/bar', './foo-bar.json')
fjson.addMountPoint(data, 'foo/bar/baz', './foo-bar-baz.json')

fjson.writeFJSON(data)
```

Then:
```bash
node example.js
```