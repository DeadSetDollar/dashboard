import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function NavBar({
  hasWeb3, user, setUser,
}:NavbarProps) {
  const history = useHistory();
  const currentTheme = useTheme();

  const [page, setPage] = useState("");

  useEffect(() => {
    return history.listen((location) => {
      setPage(location.pathname)
    })
  }, [hasWeb3, user, history]);

  const logoUrl = `./logo/logo_${currentTheme._name === 'light' ? 'black' : 'white'}.svg`

  return (
    <>
      <div style={{
        borderTop: '1px solid ' + currentTheme.border,
        backgroundColor: 'none',
        textAlign: 'center',
        height: '128px',
        width: '100%',
        fontSize: '14px'
      }}>
        <div style={{maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto'}}>
          <div style={{ display: 'flex', paddingTop: '24px'}}>
            <div style={{ width: '20%', textAlign: 'left'}}>
              <LinkBase onClick={() => history.push('/')} style={{marginRight: '16px', height: '40px'}}>
                <img src={logoUrl} height="40px" alt="Dead Set Dollar"/>
              </LinkBase>
            </div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <LinkButton title="Home" onClick={() => history.push('/')}/>
              <LinkButton title="Earn" onClick={() => history.push('/earn/')} isSelected={page.includes('/earn')}/>
              <LinkButton title="Trade" onClick={() => history.push('/trade/')} isSelected={page.includes('/trade')}/>
              <LinkButton title="Governance" onClick={() => history.push('/governance/')} isSelected={page.includes('/governance')}/>
            </div>
            <div style={{ width: '20%', textAlign: 'right'}}>
              <ConnectButton hasWeb3={hasWeb3} user={user} setUser={setUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


type linkButtonProps = {
  title:string,
  onClick: Function,
  isSelected?:boolean
}

function LinkButton({ title, onClick, isSelected = false }:linkButtonProps) {
  return (
      <LinkBase onClick={onClick} style={{marginLeft: '8px', marginRight: '8px', height: '40px'}}>
        <div style={{ padding: '1%', opacity: isSelected ? 1 : 0.5, fontSize: 17 }}>{title}</div>
      </LinkBase>
  );
}

export default NavBar;
