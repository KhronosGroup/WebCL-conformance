__kernel void test_stream_read_uchar(
    __global uchar *dst)
{
    int  tid = get_global_id(0);
    dst[0] = (uchar)'w';
}
