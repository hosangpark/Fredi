import { createContext, useState } from 'react';

const UserContext = createContext({
  user: { idx: 0, level: 3 },
  patchUser: (idx: number, level: number) => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useState({ idx: 0, level: 3 });

  const patchUser = (idx: number, level: number): void => {
    setUser({ idx, level });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        patchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
