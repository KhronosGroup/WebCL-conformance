__kernel void kernelVectorFour(
    char4 inputChar,
    uchar4 inputUChar,
    short4 inputShort,
    ushort4 inputUShort,
    int4 inputInt,
    uint4 inputUInt,
    long4 inputLong,
    ulong4 inputULong,
    float4 inputFloat,
    __global float4* output) 
{
    output[0] = convert_float4(inputChar);
    output[1] = convert_float4(inputUChar);
    output[2] = convert_float4(inputShort);
    output[3] = convert_float4(inputUShort);
    output[4] = convert_float4(inputInt);
    output[5] = convert_float4(inputUInt);
    output[6] = convert_float4(inputLong);
    output[7] = convert_float4(inputULong);
    output[8] = convert_float4(inputFloat);
}

