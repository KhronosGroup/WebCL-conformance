__kernel void kernelVectorTwo(
    char2 inputChar,
    uchar2 inputUChar,
    short2 inputShort,
    ushort2 inputUShort,
    int2 inputInt,
    uint2 inputUInt,
    long2 inputLong,
    ulong2 inputULong,
    float2 inputFloat,
    __global float2* output) 
{
    output[0] = convert_float2(inputChar);
    output[1] = convert_float2(inputUChar);
    output[2] = convert_float2(inputShort);
    output[3] = convert_float2(inputUShort);
    output[4] = convert_float2(inputInt);
    output[5] = convert_float2(inputUInt);
    output[6] = convert_float2(inputLong);
    output[7] = convert_float2(inputULong);
    output[8] = convert_float2(inputFloat);
}

