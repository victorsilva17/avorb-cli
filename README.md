# Avoid React Boilerplates (AVORB)

This is a CLI tool was created to get a faster development process with default structures such as Forms, Data tables and more.
With this CLi you can start a NextJS@14.2.5 project with predefined dependencies and settings besides a `login` page to handle user authentication. Everytime you want to create a CRUD boilerplate, you can use the `new-crud` command to generate new resouces into the project reducing development time.

Create a project:

```bash
# Bun
bunx avorb create "my-project"
```

Create a new crud (i.e tasks)

```bash
# Bun
bunx avorb new-crud "tasks"
```

The above command will generate some files into some key directories to organize and make the generated code works correctly

## Project's Dependencies:

> bun (environment)

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Jotai](https://jotai.org/)
- [React Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/docs/intro)
- [Cookies JS](https://github.com/js-cookie/js-cookie)
- [Shadcn ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [eslint](https://eslint.org/)
- [dayjs](https://day.js.org/)
- [json-server (fakie API)](https://github.com/typicode/json-server/tree/v0)
- [react-icons](https://react-icons.github.io/react-icons/)
