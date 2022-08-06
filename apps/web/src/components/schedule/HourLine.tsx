import { Text, useMantineColorScheme } from "@mantine/core"

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

  const { colorScheme } = useMantineColorScheme();

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
      <div style={{
        position: "absolute",
        width: "100%",
        top: `${percentageFromTop}%`,
        margin: 0,
        zIndex: 3,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colorScheme === "light" ? "#CCC" : "#888"
      }} />
    </div>
  }

  return <div style={{
    position: "absolute",
    width: "100%",
    top: `${percentageFromTop}%`,
    margin: 0,
    zIndex: 3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorScheme === "light" ? "#EEE" : "#444"
  }} />;
}
