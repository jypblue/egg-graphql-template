const path = require('path')
const fs = require('fs')

const {
  installDependencies,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

module.exports = {
  metalsmith: {
    before: ''
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Boss project',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    appId: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project appId',
    },
    appKey: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project only appKey name, for localStorage manage',
    },
    cdnName: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project only cdn name, Resource root address',
    },
    devEnv: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Set up default dev env',
      default: 'stage',
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
  },
  complete: function(data, { chalk }) {
    const green = chalk.green
    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
