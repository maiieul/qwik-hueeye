import { $, component$, createContextId, useContextProvider, useStore, Slot, useContext, useSignal, event$, untrack, QwikChangeEvent } from "@builder.io/qwik";
import type { QwikJSX, Signal, QwikSubmitEvent, QRL} from "@builder.io/qwik";
import type { FormFieldRecord } from "./types";
import { getDeepValue, getFormValue } from "./utils";

type FormAttributes = QwikJSX.IntrinsicElements['form'];


export interface FormProps<T extends FormFieldRecord> extends Omit<FormAttributes, 'onSubmit$'> {
  onSubmit$?: QRL<(value: T, form: HTMLFormElement, event: QwikSubmitEvent<HTMLFormElement>) => any>;
  onChange$?: QRL<(value: T, form: HTMLFormElement, event: QwikChangeEvent<HTMLFormElement>) => any>;
  value?: Signal<T>;
  initialValue?: T
}

export const FormContext = createContextId<FormState<any>>('FormContext');


export interface FormState<T extends FormFieldRecord = any> {
  formRef: Signal<HTMLFormElement | undefined>
  submitted: boolean;
  dirty: boolean;
  invalid: boolean;
  value: T;
}


/** Get initial value of the form */
export function useFormValue<T>(name?: string) {
  const form = useForm();
  // We do not want to update the control after initialValue
  const value = untrack(() => form.value);
  if (!name || !value) return;
  return getDeepValue<T>(value, name);
}

export function useForm<T extends FormFieldRecord>() {
  return useContext<FormState<T>, FormState<T>>(FormContext, {
    formRef: useSignal(),
    submitted: false,
    dirty: false,
    invalid: false,
    value: undefined,
  } as any);
}

export const Form = component$((props: FormProps<any>) => {
  const { onSubmit$, onChange$, initialValue, ...attributes } = props;
  const ref = useSignal<HTMLFormElement>();
  const state = useStore<FormState>({
    formRef: ref,
    submitted: false,
    dirty: false,
    invalid: false,
    value: initialValue ?? {},
  }, { deep: false });
  useContextProvider<FormState<any>>(FormContext, state);

  const change = event$((event: QwikChangeEvent<HTMLFormElement>, form: HTMLFormElement) => {
    state.dirty = true;
    state.value = getFormValue(ref.value!);
    if (onChange$) onChange$(state.value, form, event);
  })
  
  const submit = $((event: QwikSubmitEvent<HTMLFormElement>, form: HTMLFormElement) => {
    state.submitted = true;
    if (onSubmit$) onSubmit$(state.value, form, event);
  });

  return <form {...attributes} ref={ref} onSubmit$={submit} onChange$={change} preventdefault:submit>
    <Slot/>
  </form>
});
