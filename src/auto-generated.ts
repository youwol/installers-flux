
const runTimeDependencies = {
    "load": {
        "@youwol/os-core": "^0.1.1",
        "@youwol/flux-view": "^1.0.3",
        "@youwol/http-clients": "^1.0.2",
        "rxjs": "^6.5.5",
        "@youwol/fv-button": "^0.1.1"
    },
    "differed": {
        "@youwol/fv-code-mirror-editors": "^0.1.1",
        "@youwol/fv-group": "^0.2.1"
    },
    "includedInBundle": []
}
const externals = {
    "@youwol/os-core": {
        "commonjs": "@youwol/os-core",
        "commonjs2": "@youwol/os-core",
        "root": "@youwol/os-core_APIv01"
    },
    "@youwol/flux-view": {
        "commonjs": "@youwol/flux-view",
        "commonjs2": "@youwol/flux-view",
        "root": "@youwol/flux-view_APIv1"
    },
    "@youwol/http-clients": {
        "commonjs": "@youwol/http-clients",
        "commonjs2": "@youwol/http-clients",
        "root": "@youwol/http-clients_APIv1"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv6"
    },
    "@youwol/fv-button": {
        "commonjs": "@youwol/fv-button",
        "commonjs2": "@youwol/fv-button",
        "root": "@youwol/fv-button_APIv01"
    },
    "@youwol/fv-code-mirror-editors": {
        "commonjs": "@youwol/fv-code-mirror-editors",
        "commonjs2": "@youwol/fv-code-mirror-editors",
        "root": "@youwol/fv-code-mirror-editors_APIv01"
    },
    "@youwol/fv-group": {
        "commonjs": "@youwol/fv-group",
        "commonjs2": "@youwol/fv-group",
        "root": "@youwol/fv-group_APIv02"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "@youwol/os-core": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/os-core"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "@youwol/http-clients": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/http-clients"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/fv-button": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/fv-button"
    },
    "@youwol/fv-code-mirror-editors": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/fv-code-mirror-editors"
    },
    "@youwol/fv-group": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-group"
    }
}
export const setup = {
    name:'@youwol/installers-flux',
        assetId:'QHlvdXdvbC9pbnN0YWxsZXJzLWZsdXg=',
    version:'0.1.1',
    shortDescription:"Collections of installers related to the flux application of YouWol",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/installers-flux',
    npmPackage:'https://www.npmjs.com/package/@youwol/installers-flux',
    sourceGithub:'https://github.com/youwol/installers-flux',
    userGuide:'https://l.youwol.com/doc/@youwol/installers-flux',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    }
}
