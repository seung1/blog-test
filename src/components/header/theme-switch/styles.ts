import { NavItemStyle } from '~/components/header/styles';
import { styled } from '~/stitches.config';

export const Container = styled('div', NavItemStyle, {
  marginLeft: 'auto',
});

export const Button = styled('div', NavItemStyle, {
  border: 0,
  cursor: 'pointer',

  appearance: 'none',
  background: 'transparent',
});
