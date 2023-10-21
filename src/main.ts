import {getInput, getBooleanInput, setFailed, warning, debug, info} from '@actions/core'
// import * as github from '@actions/github'
import * as fs from 'fs'
import { simpleGit, CleanOptions } from 'simple-git'
import * as repl from "repl";

const generateBadge = (label: string, text: string, color: string) => {
  const badge = `(https://img.shields.io/badge/${label}-${text}-${color}`
  info(badge)
  return badge
}

const writeBadgeReadme = (replace: string, badge: string) => {
  let readme = fs.readFileSync('./README.md', 'utf8')
  if (readme) {
    debug(readme)
    const hasBadge = readme.split(replace)
    if (hasBadge.length > 1) {
      let readmeBadge = readme.split(replace)[1].split(')')[0]
      readme = readme.replace(readmeBadge, badge)
    } else {
      const multiline = readme.split('\n')
      badge = `${replace}${badge})` //
      multiline.splice(2, 0, badge)
      readme = multiline.join('\n')
    }
    fs.writeFile('./README.md', readme, function (err) {
      if (err) return console.log(err)
    })
  }
}

const writeButtonReadme = (newLink: string) => {
  let readme = fs.readFileSync('./README.md', 'utf8')
  if (readme) {
    const hasButton = readme.split('id="qodana-button">](')
    if (hasButton.length > 1) {
      let currentLink = readme.split('id="qodana-button">](')[1].split(')')[0]
      readme = readme.replace(currentLink, newLink)
    } else {
      const multiline = readme.split('\n')
      const button = `[<img src="https://raw.githubusercontent.com/joaofouyer/qodana-action-badge/main/dist/qodana-button.svg" align="right" width="180" alt="Link to Qodana Report" id="qodana-button">]${newLink}`
      multiline.splice(0, 0, button)
      readme = multiline.join('\n')
    }
    fs.writeFile('./README.md', readme, function (err) {
      if (err) return console.log(err)
    })
  }
}

const commitReadme = () => {
  const git = simpleGit().clean(CleanOptions.FORCE)
  git.add('./README.md')
  git.commit(':robot: Updating README with coverage Badge')
  git.push()
}

async function coverage(output: string, colors: string[]): Promise<void> {
  try {
    const coverageText = output
        .split('Total coverage:')[1]
        .split('  ')[1]
        .split('%')[0]
    debug(coverageText)
    if (coverageText) {
      const coverageNumber = Number.parseInt(coverageText)
      const color = colors[Math.round(coverageNumber / 20)]
      debug(color)
      writeBadgeReadme('![Coverage Badge]', generateBadge('coverage', `${coverageText}%`, color))
    } else {
      warning('No coverage info was found on summary.');
    }
  } catch (error) {
    if (error instanceof Error) warning(error.message)
    else warning('Exception generating coverage badge.')
  }
}

async function quality(output: string, colors: string[]): Promise<void> {
  try {
    const qualityText = output.split('**')[1].split(' ')[0]
    debug(qualityText)
    if (qualityText) {
      const errors = Number.parseInt(qualityText) // 0
      let index = Math.round(errors / 3)
      index = index > 5 ? 5 : index
      const color = colors[5 - index]
      writeBadgeReadme('![Quality Badge]', generateBadge('errors', qualityText, color))
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
    else warning('Exception generating quality badge.')
  }
}

async function button(output: string): Promise<void> {
  try {
    const link = `(https://qodana.cloud/projects/${output.split('https://qodana.cloud/projects/')[1].split('\n')[0]})`
    debug(link)
    if (link) {
      writeButtonReadme(link)
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
    else warning('Exception generating Qodana button.')
  }


}

export async function run(): Promise<void> {
  try {

    const output = getInput('qodana-output')
    const generateCoverage = getBooleanInput('generate-coverage')
    const generateQuality = getBooleanInput('generate-quality')
    const generateQodanaButton = getBooleanInput('generate-qodana-button')

    debug(`Coverage: ${generateCoverage}`)
    debug(`Quality: ${generateQuality}`)
    debug(`Button: ${generateQodanaButton}`)
    debug(`The output from the source action is ${output}`)

    const colors = [
      'e05d44',
      'fe7d37',
      'dfb317',
      'a4a61d',
      '97ca00',
      '4c1'
    ]
    let coveragePromise, qualityPromise, buttonPromise
    if (generateCoverage) {
      coveragePromise = coverage(output, colors)
    }

    if (generateQuality) {
      qualityPromise = quality(output, colors)
    }

    if (generateQodanaButton) {
      buttonPromise = button(output)
    }

    Promise.all([coveragePromise, qualityPromise, buttonPromise])
        .then(() => {
          commitReadme()
        })
        .catch((error) => {
          warning(`Error generating badges ${error}`)
        })

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}
