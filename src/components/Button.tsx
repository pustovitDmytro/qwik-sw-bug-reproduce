import { $, component$,
    Slot } from '@builder.io/qwik';
import type {
    ClassList,
    QwikMouseEvent
} from '@builder.io/qwik';
import styles from './Button.module.css';

type ButtonProps = {
  inline?: boolean;
  icon?:boolean;
  class?: ClassList | ClassList[];
  onClick?: (event: QwikMouseEvent, element: HTMLButtonElement) => any
};


export default component$((props: ButtonProps) => {
    return (
        <button
            class={[
                styles.button,
                props.class,
                {
                    [styles.inline] : props.inline,
                    [styles.icon]   : props.icon
                }

            ]}
            onClick$={props.onClick}
        >
            <Slot/>
        </button>
    );
});
