import sys
from troposphere import GetAtt, Join, Output, Parameter, Ref, Template
from troposphere.s3 import Bucket, PublicRead, WebsiteConfiguration

env = sys.argv[1]

COMPONENT_NAME = "YaegarBooksWeb"

t = Template(COMPONENT_NAME)

t.add_version("2010-09-09")

t.add_description(COMPONENT_NAME + " stacks for env " + env)

s3bucket = t.add_resource(
    Bucket(
        "S3BucketForWebsiteContent",
        AccessControl=PublicRead,
        WebsiteConfiguration=WebsiteConfiguration(
            IndexDocument="index.html",
            ErrorDocument="error.html"
        )
    )
)

t.add_output([
    Output(
        "WebsiteURL",
        Value=GetAtt(s3bucket, "WebsiteURL"),
        Description="URL for website hosted on S3"
    ),
    Output(
        "S3BucketSecureURL",
        Value=Join("", ["http://", GetAtt(s3bucket, "DomainName")]),
        Description="Name of S3 bucket to hold website content"
    )
])

print(t.to_json())
