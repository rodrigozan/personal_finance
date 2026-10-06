```powershell
yarn create next-app next-temp --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-yarn --skip-install
```

```powershell
Get-ChildItem -Path .\next-temp -Force | Move-Item -Destination . -Force
```

```powershell
Remove-Item .\next-temp -Recurse -Force
```

```powershell
yarn install
```

Depois, as dependências:

```powershell
yarn add @supabase/supabase-js @supabase/ssr zod pluggy-sdk react-pluggy-connect recharts react-hook-form @hookform/resolvers date-fns lucide-react clsx tailwind-merge csv-parse ofx-js pino server-only
```

```powershell
yarn add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier
```