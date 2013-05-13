__kernel void sample_test_single_line(
    __global float *src,
    __global int *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = (int)src[tid];
}
