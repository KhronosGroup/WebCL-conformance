__kernel void getArg_sample(
    write_only __global float* input,
    read_write __global float* output
    read_only private sampler webCLSampler)
{
    unsigned int i = get_global_id(0);
    output[i] = input[i];
}
