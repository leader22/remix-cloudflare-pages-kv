import { useLoaderData, Form, redirect } from "remix";

export const loader = async ({ context }) => {
  const { keys } = await context.ITEMS.list();
  const items = await Promise.all(keys.map(({ name }) =>
    context.ITEMS.get(name).then((desc) => ({ name, desc }))
  ));
  console.log("READ");
  return items || [];
};

export const action = async ({ request, context }) => {
  const body = await request.formData();
  const name = body.get("name");
  const desc = body.get("desc");

  await context.ITEMS.put(name, desc);
  console.log("WRITE", { name, desc });

  return redirect("/");
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Welcome to Remix + Pages w/ Functions</h1>

      <Form method="post" action="/?index">
        <div>
          <label><input name="name" type="text" required /></label>
        </div>
        <div>
          <label><textarea name="desc"></textarea></label>
        </div>
        <button type="submit">Create</button>
      </Form>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
