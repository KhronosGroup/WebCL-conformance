__kernel void kernelVectorSixteen(
    char16 inputChar,
    uchar16 inputUChar,
    short16 inputShort,
    ushort16 inputUShort,
    int16 inputInt,
    uint16 inputUInt,
    long16 inputLong,
    ulong16 inputULong,
    float16 inputFloat,
    __global float16* output)
{
    output[0] = convert_float16(inputChar);
    output[1] = convert_float16(inputUChar);
    output[2] = convert_float16(inputShort);
    output[3] = convert_float16(inputUShort);
    output[4] = convert_float16(inputInt);
    output[5] = convert_float16(inputUInt);
    output[6] = convert_float16(inputLong);
    output[7] = convert_float16(inputULong);
    output[8] = convert_float16(inputFloat);
}

