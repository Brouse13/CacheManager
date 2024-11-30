memory = []

startAddress = 0;
memorySize = 128;
memoryStep = 6;
function __initMemory() {
    let endAddress = startAddress + memorySize;
    let maxValue = Math.pow(2, memoryStep)

    for (let i = startAddress; i < endAddress; i+=memoryStep) {
        let address = "0x" + ("0000" +i.toString(16)).slice(-4);
        let value = Math.floor(Math.random() * maxValue);

        memory.push({ address, value });
        memoryRender({ address, value });
    }
}