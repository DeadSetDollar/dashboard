import React from 'react';
import { Box, LinkBase, Tag } from '@aragon/ui';

type MainButtonPropx = {
    title: string,
    description: string,
    icon: any,
    onClick: Function,
    tag?:string
  }
  
  function MainButton({
    title, description, icon, onClick, tag,
  }:MainButtonPropx) {
    return (
      <LinkBase onClick={onClick} style={{ width: '100%' }}>
        <Box>
          <div style={{ padding: 10, fontSize: 18 }}>
            {title}
            {tag ? <Tag>{tag}</Tag> : <></>}
          </div>
          <span style={{ fontSize: 48 }}>
            {icon}
          </span>
          {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
          <div style={{ fontSize: 20, paddingTop: 5 }}>
            {' '}
            {description}
            {' '}
          </div>
  
        </Box>
      </LinkBase>
    );
}

export default MainButton;