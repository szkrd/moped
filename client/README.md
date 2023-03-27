# moped modern client

This is a [vite app](https://vitejs.dev/) (react + typescript-swc).

Use `npm run dev` or `npm run build`, by default it connects to a local server, see [.env.example](./.env.example).

## TODO

- [ ] implement all the functionality of the prototype vanilla js client
- [x] lock UI controls (partially)
- [x] Button (and ApiButton?) control disabled state
- [x] optimistic UI updates (partially, but it still is painfully slow)
- [ ] responsive layout
- [ ] add description to favorite
- [ ] error handling
- [ ] ytdlp
- [ ] lyrics (?)

## WARNING

### lint

1. Eslint had to be shoehorned into the project (using a vite plugin and lots of eslint plugins),
   because Vite (react SWC template) did not lint(?).
2. Eslint will move to a new config format (good bye to `.eslintrc`), this will affect eslint plugins.
3. Probably updating eslint/tsc/vite is not going to be a simple affair.
4. I'm still not sure if the eslint/ts parser works 100% fine, it had some weird ast parse errors.
