function Authorization() {
  const token = sessionStorage.getItem('token');
  const config = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
  return config;
}

export default Authorization;
