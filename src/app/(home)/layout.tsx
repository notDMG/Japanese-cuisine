interface IProps {
  children: React.ReactNode
}

export default function LayoutHome({ children }: IProps) {
  return <section>{children}</section>
}
