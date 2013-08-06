__kernel void kernelVectorEight(
    char8 inputChar,
    uchar8 inputUChar,
    short8 inputShort,
    ushort8 inputUShort,
    int8 inputInt,
    uint8 inputUInt,
    long8 inputLong,
    ulong8 inputULong,
    float8 inputFloat,
    __global float8* output) 
{
    output[0] = convert_float8(inputChar);
    output[1] = convert_float8(inputUChar);
    output[2] = convert_float8(inputShort);
    output[3] = convert_float8(inputUShort);
    output[4] = convert_float8(inputInt);
    output[5] = convert_float8(inputUInt);
    output[6] = convert_float8(inputLong);
    output[7] = convert_float8(inputULong);
    output[8] = convert_float8(inputFloat);
}

