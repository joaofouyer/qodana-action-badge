import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    const generateCoverage = core.getBooleanInput('generate-coverage')
    const generateQuality = core.getBooleanInput('generate-quality')
    const generateQodanaButton = core.getBooleanInput('generate-qodana-button')

    console.log(`Coverage: ${generateCoverage}`)
    console.log(`Quality: ${generateQuality}`)
    console.log(`Button: ${generateQodanaButton}`)

    const summary = process.env.INPUT_QODANA_SCAN_OUTPUT_SUMMARY
    console.log(`The output from the source action is ${summary}`)

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
