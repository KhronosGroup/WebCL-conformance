__kernel void kernelVectorThree(
    char3 inputChar,
    uchar3 inputUChar,
    short3 inputShort,
    ushort3 inputUShort,
    int3 inputInt,
    uint3 inputUInt,
    long3 inputLong,
    ulong3 inputULong,
    float3 inputFloat,
    __global float3* output) 
{
    output[0] = convert_float3(inputChar);
    output[1] = convert_float3(inputUChar);
    output[2] = convert_float3(inputShort);
    output[3] = convert_float3(inputUShort);
    output[4] = convert_float3(inputInt);
    output[5] = convert_float3(inputUInt);
    output[6] = convert_float3(inputLong);
    output[7] = convert_float3(inputULong);
    output[8] = convert_float3(inputFloat);
}

