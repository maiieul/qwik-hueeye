import { component$, useId, useStyles$ } from "@builder.io/qwik";
import { MenuItemBtn, Menu, MenuTrigger, MenuItemTrigger, MatIcon } from "qwik-hueeye-lib";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  const menuId = useId();
  const nestedMenuId = useId();
  return <section class="menus">
    <MenuTrigger menuId={menuId} class="btn-fill primary">
      Open a menu
    </MenuTrigger>
    <Menu id={menuId}>
      <MenuItemBtn>Item 1</MenuItemBtn>
      <MenuItemBtn>Item 2</MenuItemBtn>
      <MenuItemTrigger id="radio" menuId={nestedMenuId}>
        Menu Radio
        <MatIcon name="chevron_right" />
      </MenuItemTrigger>
    </Menu>
    <Menu id={nestedMenuId} data-position="inline">
      <MenuItemBtn>Nested Item 1</MenuItemBtn>
      <MenuItemBtn>Nested Item 2</MenuItemBtn>
    </Menu>
  </section>
})