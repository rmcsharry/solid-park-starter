import type { ElementType, StyledComponent } from 'styled-system/types'
import { createContext, type JSX, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cx } from 'styled-system/css'
import { isCssProperty, styled } from 'styled-system/jsx'

type Props = Record<string, unknown>
interface Recipe {
  (props?: Props): Props
  splitVariantProps: (props: Props) => [Props, Props]
}

type Slot<R extends Recipe> = keyof ReturnType<R>
interface Options { forwardProps?: string[] }

function shouldForwardProp(prop: string, variantKeys: string[], options: Options = {}) {
  return options.forwardProps?.includes(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
}

export function createStyleContext<R extends Recipe>(recipe: R) {
  const StyleContext = createContext<Record<Slot<R>, string> | null>(null)

  // eslint-disable-next-line ts/no-empty-object-type
  const withRootProvider = <P extends {}>(Component: ElementType): ((props: P) => JSX.Element) => {
    const StyledComponent = (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props)
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>

      return (
        <StyleContext.Provider value={slotStyles}>
          <Component {...localProps} />
        </StyleContext.Provider>
      )
    }
    return StyledComponent
  }

  const withProvider = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>,
    options?: Options,
  ): ((props: P) => JSX.Element) => {
    const StyledComponent = styled(
      Component,
      {},
      {
        shouldForwardProp: (prop, variantKeys) => shouldForwardProp(prop, variantKeys, options),
      },
    ) as StyledComponent<ElementType>

    return (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props)
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>

      return (
        <StyleContext.Provider value={slotStyles}>
          <Dynamic
            component={StyledComponent}
            {...localProps}
            class={cx(slotStyles?.[slot], props.class)}
          />
        </StyleContext.Provider>
      )
    }
  }

  const withContext = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>,
  ): ((props: P) => JSX.Element) => {
    const StyledComponent = styled(Component)

    const Foo = (props: P) => {
      const slotStyles = useContext(StyleContext)
      return (
        <Dynamic
          component={StyledComponent}
          {...props}
          class={cx(slotStyles?.[slot], props.class)}
        />
      )
    }
    return Foo
  }

  return {
    withRootProvider,
    withProvider,
    withContext,
  }
}
