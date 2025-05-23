import { Button, Flex, Typography } from "antd";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

const ChartDownload = ({ chartId }: { chartId: any }) => {
    const { t } = useTranslation();
    const titleData: any = t(chartId);
    const downloadItems = ["svg", "png"];
    // Function for downloading charts
    const downloadItem = async (data: any) => {
        if (data == "png") {
            const div: any = document.getElementById(chartId);
            html2canvas(div)?.then((canvas: any) => {
                const link = document.createElement("a");
                link.download = titleData + ".png";
                canvas.toBlob((blob: any) => {
                    const url = URL.createObjectURL(blob);
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    div.style.padding = "0px";
                });
            });
            // Download a chart in SVG format.
        } else if (data == "svg") {
            // const canvas = document.querySelector(`#${chartId} canvas`) as HTMLCanvasElement;
            const canvas = document.querySelector(`#${CSS.escape(chartId)} canvas`) as HTMLCanvasElement;
            if (!canvas) {
                console.error("Canvas element not found");
                return;
            }

            // Get canvas dimensions
            const { width, height } = canvas;

            // Convert canvas to Data URL (base64-encoded PNG)
            const canvasDataURL = canvas.toDataURL("image/png");

            // Create an SVG element
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElement.setAttribute("width", width.toString());
            svgElement.setAttribute("height", height.toString());
            svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);

            // Embed the canvas image into the SVG
            const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.setAttribute("href", canvasDataURL);
            image.setAttribute("width", width.toString());
            image.setAttribute("height", height.toString());
            svgElement.appendChild(image);

            // Serialize the SVG content
            const svgContent = new XMLSerializer().serializeToString(svgElement);

            // Create a Blob for the SVG
            const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

            // Trigger the download
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(svgBlob);
            downloadLink.download = `${titleData}.svg`;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
        }
    }
    return (
        <Flex justify="space-between" align="middle">
            <Text className="fs-13 f-reg">Download</Text>
            <Text>
                {downloadItems.map((dropdownList: any) => (
                    <Button className="ml-8" size="small" onClick={() => downloadItem(dropdownList)}>{dropdownList}</Button>
                ))}
            </Text>
        </Flex>
    )
}
export default ChartDownload;