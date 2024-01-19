<script lang="ts">
  export let form;
</script>

<h1>Sign in</h1>

<form method="post">
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={form?.email ?? ""}
  />
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={form?.password ?? ""}
  />
  <button type="submit">Sign in</button>
</form>

{#if form?.error}
  <p>{form?.error}</p>
{/if}

<p>Don't have an account? <a href="/signup">Sign up</a></p>
