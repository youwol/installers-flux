import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template, AuxiliaryModule, Bundles, MainModule
from youwol_utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / 'package.json')


template = Template(
    path=folder_path,
    type=PackageType.Library,
    name=pkg_json['name'],
    version=pkg_json['version'],
    shortDescription=pkg_json['description'],
    author=pkg_json['author'],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            externals={
                "@youwol/os-core": "^0.1.8",
                "@youwol/flux-view": "^1.0.3",
                "@youwol/cdn-client": "^1.0.2",
                "@youwol/http-clients": "^2.0.5",
                "@youwol/http-primitives": "^0.1.2",
                "rxjs": "^6.5.5",
                "@youwol/fv-button": "^0.1.1",
                "@youwol/fv-code-mirror-editors": "^0.2.1",
                "@youwol/fv-group": "^0.2.1",
            }
        ),
        devTime={
            "@types/lz-string": "^1.3.34",  # Required to generate doc
            "lz-string": "^1.4.4",  # Required to generate doc
        }
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./lib/index.ts",
            loadDependencies=["@youwol/os-core", "@youwol/flux-view", "@youwol/http-clients", "rxjs",
                              "@youwol/fv-button"]
        ),
        auxiliaryModules=[
            AuxiliaryModule(
                name='context-menu-publish-app',
                entryFile="./lib/auxiliary-modules/publish-app/index.ts",
                loadDependencies=["@youwol/fv-code-mirror-editors", "@youwol/fv-group", "@youwol/cdn-client"]
            )
        ],
    ),
    userGuide=True
)

generate_template(template)

shutil.copyfile(
    src=folder_path / '.template' / 'src' / 'auto-generated.ts',
    dst=folder_path / 'src' / 'auto-generated.ts'
)
for file in ['README.md', '.gitignore', '.npmignore', '.prettierignore', 'LICENSE', 'package.json',
             'tsconfig.json', 'webpack.config.ts']:
    shutil.copyfile(
        src=folder_path / '.template' / file,
        dst=folder_path / file
    )

