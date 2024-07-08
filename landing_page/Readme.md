## Welcome to GenProse Landing Page dist
- We are using cloudflare workers for API and pages for frontend

## How to deploy changes?
# These steps assume you have already configured the `.toml` file with the correct settings.
- To deploy api changes - first commit and push the changes - use `wrangler publish` in your terminal publish your d1 changes.
- To deploy front end changes - use `wrangler pages publish /path-to-build-dir` to publish your changes.

Refer https://developers.cloudflare.com/workers/wrangler/commands for more info
