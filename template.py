from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template

template = Template(
    path=Path(__file__).parent,
    type=PackageType.Library,
    name="@youwol/installers-flux",
    version="0.0.3-wip",
    shortDescription="Collections of installers related to the flux application of YouWol",
    author="greinisch@youwol.com",
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            load={
                "@youwol/os-core": "^0.0.6",
                "@youwol/flux-view": "^0.1.1",
                "@youwol/http-clients": "^0.1.11",
                "rxjs": "^6.5.5",
                "@youwol/fv-button": "^0.0.5",
            },
            differed={
                "@youwol/fv-code-mirror-editors": "^0.0.1",
                "@youwol/fv-group": "^0.1.1",
            }
        ),
        devTime={
            "uuid": "^8.3.2",
            "@youwol/cdn-client": "^0.1.3",
            "codemirror": "^5.5.0",
            "@typescript/vfs": "^1.3.5",
        }
    ),
    userGuide=True
    )

generate_template(template)
