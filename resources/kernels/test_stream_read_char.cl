__kernel void test_stream_read_char(
    __global char *dst)
{
    int  tid = get_global_id(0);
    dst[0] = (char)'w';
}
