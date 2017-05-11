# insector-xhr-service

> Wrapper classes for ajax and JSON RPC requests.

## Install

```sh
npm install --save insector-xhr-service
```

## Usage

```js
import {JSONService} from 'insector-xhr-service';

const promise = JSONService.at('/api').rpc('system.registry');

```
