import { component$, createContextId, Signal, Slot, useContext, useContextProvider, useSignal, useVisibleTask$, useTask$ } from "@builder.io/qwik";
import { SvgGradient } from "../svg-gradient";
import './hue.scss';

interface HueEyeState {
  hue: Signal<number | undefined>;
}

const initHue = `
const theme = sessionStorage.getItem('hueeye');
if (theme) {
  const state = JSON.parse(theme);
  if (state.hue) {
    document.documentElement.style.setProperty('--hue', state.hue);
  }
}`;

const HueEyeSession = component$(() => {
  const { hue } = useContext(HueEyeContext);
  useVisibleTask$(() => {
    const localHue = document.documentElement.style.getPropertyValue('--hue');
    if (localHue) hue.value = Number(localHue);
  });
  useVisibleTask$(({ track }) => {
    const change = track(() => hue.value);
    if (typeof change === 'undefined') return;
    sessionStorage.setItem('hueeye', JSON.stringify({ hue: change }));
  });
  return <script dangerouslySetInnerHTML={initHue}></script>
});

const HueEyeContext = createContextId<HueEyeState>('HueEyeContext');

export const useHueEye = () => useContext(HueEyeContext);

interface HueEyeProps {
  storage?: boolean;
}

export const HueEyeProvider = component$(({ storage }: HueEyeProps) => {
  const state: HueEyeState = {
    hue: useSignal()
  };
  useTask$(({ track }) => {
    const change = track(() => state.hue.value);
    if (typeof change === 'undefined') return;
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--hue', change.toString());
  });
  useContextProvider(HueEyeContext, state);
  return <>
    {storage && <HueEyeSession/> }
    <Slot/>
    <SvgGradient/>
  </>
});