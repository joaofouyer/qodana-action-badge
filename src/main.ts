import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    const output = core.getInput('qodana-output')
    const generateCoverage = core.getInput('generate-coverage').toLowerCase() === 'true'
    const generateQuality = core.getInput('generate-quality').toLowerCase() === 'true'
    const generateQodanaButton = core.getInput('generate-qodana-button').toLowerCase() === 'true'

    console.log(`Coverage: ${generateCoverage}`)
    console.log(`Quality: ${generateQuality}`)
    console.log(`Button: ${generateQodanaButton}`)
    console.log(`The output from the source action is ${output}`)

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
