import { Text } from "@mantine/core"

export type SharedLineProps = {
  lineIndex: number,
  lineCount: number
}

export type HourLineProps = SharedLineProps & ({
  isMajor: true,
  text: string
} | {
  isMajor: false,
})

export default (props: HourLineProps) => {
  const percentageFromTop = 100 * props.lineIndex / (props.lineCount - 1);

  if (props.isMajor) {
    return <div
      style={{
        position: "absolute",
        width: "100%",
        top: `${percentageFromTop}%`,
        margin: 0,
        zIndex: 3
      }}
    >
      <Text sx={{
        position: "absolute",
        transform: "translateX(calc(-100% - 10px))",
        top: -10
      }}>{props.text}</Text>
      <hr style={{ margin: 0 }} />
    </div>
  }

  throw new Error("Minor hour lines are not implemented yet")
}
