memory = []

let memoryOptions = {
    startAddress: 0,        // The start address of the memory
    memorySize: 1_048_576,  // The size of the memory in bytes
    maxValue: 128           // The max value of the memory
}

function __initMemory() {
    let { startAddress, memorySize, maxValue } = memoryOptions;
    let endAddress = startAddress + memorySize;

    // Limit te memory to 100 addresses
    let limit = Math.min(100, endAddress + startAddress);

    for (let i = startAddress; i < limit; i += 1) {
        let address = "0x" + ("0000" +i.toString(16)).slice(-4);
        let value = Math.floor(Math.random() * maxValue);

        memory.push({ address, value });
        memoryRender({ address, value });
    }
}

function readFromMemory(address) {
    return memory[address];
}