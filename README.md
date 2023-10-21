[<img src="https://raw.githubusercontent.com/joaofouyer/qodana-action-badge/main/dist/qodana-button.svg" align="right" width="180" alt="Link to Qodana Report" id="qodana-button">](https://qodana.cloud/projects/zEXxj/reports/84Nk2)
# Qodana Scan Badge
This action creates coverage and code quality badges from a [Qodana Scan Action](https://github.com/marketplace/actions/qodana-scan) output and updates your README.

## Inputs

### `generate-coverage`

**Not required** Generate Test Coverage Badge. Default `"false"`.

### `generate-quality`

**Not required** Generate Code Quality Badge. Default `"false"`.

### `generate-qodana-button`

**Not required** Generate a button to Qodana Report with link. Default `"false"`.

## Example usage

```yaml
uses: joaofouyer/qodana-scan-badge@1.0.0
with:
  generate-coverage: true
  generate-quality: true
  generate-qodana-button: true
```

## Future Work

This version automatically updates your README file so you can use this action out of the box. But in some cases, you
might not want this behaviour.

So another approach is to generate a `.svg` file and saves it in the repository in a specified path and you can set 
it manually in the README.
