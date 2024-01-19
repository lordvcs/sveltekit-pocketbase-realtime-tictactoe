<script lang="ts">
  export let form;
</script>

<h1>Sign up</h1>

<form method="post">
  <input type="text" placeholder="Name" name="name" value={form?.name ?? ""} />
  <input
    type="email"
    placeholder="Email"
    name="email"
    value={form?.email ?? ""}
  />
  <input
    type="password"
    placeholder="Password"
    name="password"
    value={form?.password ?? ""}
  />
  <button type="submit">Sign up</button>
</form>

{#if form?.error}
  <p>{form?.error}</p>
{/if}

<p>Already have an account? <a href="/login">Log in</a></p>
