package com.wallet.admin;

import com.wallet.common.utils.StringUtils;
import org.apache.commons.codec.Charsets;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.*;

/**
 * @ClassName: test
 * @Description:
 * @Author
 * @Date 2022/8/8
 * @Version 1.0
 */
public class test {
    public static void main(String[] args) {
        String result=null;
/*
        Map<String, String> params = new HashMap<>();
        params.put("apiKey","7956ca03fe44238ef1d254799de1b556");
        params.put("nonce", System.currentTimeMillis()/1000+"_"+ StringUtils.getRandom(5));
        params.put("timestamp",String.valueOf(System.currentTimeMillis()/1000));
*/

        Map<String, String> params = new HashMap<>();
        params.put("chainid","1");
        params.put("id","1");
        //params.put("data","0xe4445210000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000001");
        //params.put("contact","cfxtest:acfpbb9kn2b2z3bev2435dk6j236gzc0kjjj4hwm45");



        params.put("contract","cfxtest:acdk44u31uwr42hy4h6ux03r5kw4ffx9ausk8k53kg");
        //params.put("tokenId","1");

        //params.put("interfaceID","0x01ffc9a7");
        params.put("hash","0xf736bbc8b9c807a57c211f2c6235ebccdd9f425f73497d769555550edcf11c89");
        //params.put("fromAddress","cfxtest:aajpefpv3b528myyvv1p6fy8ey5j6ve63ezjb7ebxv");
        //params.put("contract","0xc54b96b04AA8828b63Cf250408E1084E9F6Ac6c8");
        //params.put("data","0xc87b56dd0000000000000000000000000000000000000000000000000000000000000000");
        Map<String, String> headerMap = makeHeaders(params);
        System.out.println("header参数》》"+headerMap);
        System.out.println("body参数》》"+params);

        String rsc= getRequest("http://localhost:8088/api/v1/chain/getTransactionByHash",headerMap,params);
        System.out.println(rsc);
        String rsc1= getRequest("http://35.175.145.216:8087/api/v1/chain/getTransactionByHash",headerMap,params);
        System.out.println(rsc1);


/*
        String rs1= getRequest("http://35.175.145.216:8087/api/v1/chain/queryUser",headerMap,params);
        System.out.println(rs1);
*/

/*
        String rs1= postRequest("http://localhost:8088/api/v1/chain/create",headerMap,params);
        System.out.println(rs1);
*/

/*
        String rsc= getRequest("http://localhost:8088/api/v1/chain/queryUser",headerMap,params);
        System.out.println(rsc);
*/

/*
        String rs= getRequest("http://localhost:8088/api/v1/chain/supportsInterface",headerMap,params);
        System.out.println(rs);
*/

    }
    private static Map<String, String> makeHeaders(Map<String, String> data){
        Map<String, String> rsMap = new HashMap<>();
        String nonce = System.currentTimeMillis()/1000+""+ (int)((Math.random()*9+1)*100000);
        String timestamp = System.currentTimeMillis()/1000+"";
/*
        timestamp="1660278066";
        nonce="1660278066380482";
*/
        rsMap.put("apiKey","7956ca03fe44238ef1d254799de1b556");
        rsMap.put("timestamp",timestamp);
        rsMap.put("nonce",nonce);
        SortedMap<String,String> sortedMap = new TreeMap<>();
        sortedMap.putAll(rsMap);
        sortedMap.putAll(data);
        StringBuilder sbd = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedMap.entrySet()) {
            // 排除空val的参数
            if (StringUtils.isEmpty(entry.getValue())){
                continue;
            }
            sbd.append(entry.getKey()).append(entry.getValue());
        }
        System.out.println("ASCII排序字符串"+sbd.toString());
        String apiSecret="bd09139024cdd3136a4f6cf60038c1194e6641063e413c47f517a579fbb158ba";
        sbd.append(apiSecret);
        rsMap.put("sign",DigestUtils.md5Hex(sbd.toString()));
/*
        System.out.println(nonce);
        System.out.println(timestamp);
        System.out.println(rsMap.get("sign"));
*/
        return rsMap;
    }
    private static String sign(String nonce, Map<String, String> data) {
        List paramArr = new ArrayList<>();
        for (String key : data.keySet()) {
            paramArr.add(key + "=" + data.get(key));
        }
        Collections.sort(paramArr);
        System.out.println(paramArr);
        String paramStr = String.join("", paramArr);

        String signature = DigestUtils.md5Hex(paramStr);
        return signature;
    }
    public static String postRequest(String url, Map<String,String> headerMap, Map<String, String> paramsMap) {
        String result = null;
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost post = new HttpPost(url);
        List<NameValuePair> content = new ArrayList<NameValuePair>();
        Iterator iterator = paramsMap.entrySet().iterator();           //将content生成entity
        while(iterator.hasNext()){
            Map.Entry<String,String> elem = (Map.Entry<String, String>) iterator.next();
            content.add(new BasicNameValuePair(elem.getKey(),elem.getValue()));
        }
        CloseableHttpResponse response = null;
        try {
            Iterator headerIterator = headerMap.entrySet().iterator();          //循环增加header
            while(headerIterator.hasNext()){
                Map.Entry<String,String> elem = (Map.Entry<String, String>) headerIterator.next();
                post.addHeader(elem.getKey(),elem.getValue());
            }
            if(content.size() > 0){
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(content,"UTF-8");
                post.setEntity(entity);
            }
            response = httpClient.execute(post);            //发送请求并接收返回数据
            if(response != null && response.getStatusLine().getStatusCode() == 200)
            {
                HttpEntity entity = response.getEntity();       //获取response的body部分
                result = EntityUtils.toString(entity);          //读取reponse的body部分并转化成字符串
            }
            return result;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                httpClient.close();
                if(response != null)
                {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
        return null;
    }

    public static String getRequest(String url,  Map<String, String> headerMap,Map<String, String> paramMap) {
        String result = "";
        BufferedReader in = null;
        List<NameValuePair> formparams = setHttpParams(paramMap);
        String param = URLEncodedUtils.format(formparams, "UTF-8");

        String reqUrl = url + "?" + param;
        try {
            RequestConfig config = RequestConfig.custom().setConnectTimeout(3000)
                    .setConnectionRequestTimeout(3000).build();
            HttpClient client = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
            HttpGet htGet = new HttpGet(reqUrl);
            // 添加http headers
            if (headerMap != null && headerMap.size() > 0) {
                for (String key : headerMap.keySet()) {
                    htGet.addHeader(key, headerMap.get(key));
                }
            }
            HttpResponse r = client.execute(htGet);
            in = new BufferedReader(new InputStreamReader(r.getEntity().getContent(), Charsets.UTF_8));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in = null;
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }
    private static List<NameValuePair> setHttpParams(Map<String, String> paramMap) {
        List<NameValuePair> formparams = new ArrayList<NameValuePair>();
        Set<Map.Entry<String, String>> set = paramMap.entrySet();
        for (Map.Entry<String, String> entry : set) {
            formparams.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
        }
        return formparams;
    }
}
