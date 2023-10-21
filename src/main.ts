import { getInput, getBooleanInput, setFailed } from '@actions/core'
// import * as github from '@actions/github'
import * as fs from 'fs'
import { simpleGit, CleanOptions } from 'simple-git'

export async function run(): Promise<void> {
  try {
    const git = simpleGit().clean(CleanOptions.FORCE)
    const output = getInput('qodana-output')
    const generateCoverage = getBooleanInput('generate-coverage')
    const generateQuality = getBooleanInput('generate-quality')
    const generateQodanaButton = getBooleanInput('generate-qodana-button')

    console.log(`Coverage: ${generateCoverage}`)
    console.log(`Quality: ${generateQuality}`)
    console.log(`Button: ${generateQodanaButton}`)
    console.log(`The output from the source action is ${output}`)

    const coverageColorArr = [
      'e05d44',
      'fe7d37',
      'dfb317',
      'a4a61d',
      '97ca00',
      '4c1'
    ]

    if (generateCoverage) {
      const coverageText = output
        .split('Total coverage:')[1]
        .split('  ')[1]
        .split('%')[0]
      console.log(coverageText)
      const coverageNumber = Number.parseInt(coverageText)
      const color = coverageColorArr[Math.round(coverageNumber / 20)]
      console.log(color)
      const coverageBadge = `(https://img.shields.io/badge/coverage-${coverageText}-${color}`
      console.log(coverageBadge)
      let readme = fs.readFileSync('./README.md', 'utf8')
      if (readme) {
        console.log(readme)
        let readmeBadge = readme.split('![Coverage Badge]')[1]
        readmeBadge = readmeBadge.split(')')[0]
        if (readmeBadge) {
          readme = readme.replace(readmeBadge, coverageBadge)
        } else {
          const multiline = readme.split('\n')
          multiline.splice(2, 0, coverageBadge)
          readme = multiline.join('\n')
        }
        fs.writeFile('./README.md', readme, function (err) {
          if (err) return console.log(err)
        })

        git.add('./README.md')
        git.commit(':robot: Updating README with coverage Badge')
        git.push()
      }
    }
    // if (generateQuality) { }

    // if (generateQodanaButton) { }

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}
