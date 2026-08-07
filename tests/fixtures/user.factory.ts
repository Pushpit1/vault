export function createTestUser() {
  const id =
    Date.now().toString() +
    Math.random()
      .toString(36)
      .substring(2, 8);

  return {
    name: "Integration Test User",
    email: `user-${id}@test.com`,
    password: "Password123",
  };
}