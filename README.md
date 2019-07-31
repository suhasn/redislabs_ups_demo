# redislabs_ups_demo

This is a demo application to consume a Redis DB instance provided by the independent software vendor (RedisLabs) in an application running on SAP Cloud Platform via CF User Provided Services.

Steps:

1. Create a Redis DB instance on https://redislabs.com/. For this demo I have created a Free Instance with a limit of 30MB.

2. Redis is available on a MultiCloud platform, so you could choose the Hyperscaler (AWS/Azure/GCP) of your choice and the region of your choice.

3. Provide an appropriate name and click create. It would create an instance and provide the connection details such as the host, port and password to connect to this instance.

4. Use these parameters and create a new User Provided Service on SAP Cloud Platform. You could follow the blog:https://blogs.sap.com/2019/07/19/consuming-hyperscaler-managed-services-on-sap-cloud-platform-as-user-provided-services/

Write to me in case of any issues: suhas.narasimhan@sap.com
