// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: checkin.proto

#include "checkin.pb.h"

#include <algorithm>

#include <google/protobuf/io/coded_stream.h>
#include <google/protobuf/extension_set.h>
#include <google/protobuf/wire_format_lite.h>
#include <google/protobuf/descriptor.h>
#include <google/protobuf/generated_message_reflection.h>
#include <google/protobuf/reflection_ops.h>
#include <google/protobuf/wire_format.h>
// @@protoc_insertion_point(includes)
#include <google/protobuf/port_def.inc>

PROTOBUF_PRAGMA_INIT_SEG

namespace _pb = ::PROTOBUF_NAMESPACE_ID;
namespace _pbi = _pb::internal;

namespace Aws {
namespace IoTFleetWise {
namespace Schemas {
namespace CheckinMsg {
PROTOBUF_CONSTEXPR Checkin::Checkin(
    ::_pbi::ConstantInitialized): _impl_{
    /*decltype(_impl_.document_sync_ids_)*/{}
  , /*decltype(_impl_.timestamp_ms_epoch_)*/uint64_t{0u}
  , /*decltype(_impl_._cached_size_)*/{}} {}
struct CheckinDefaultTypeInternal {
  PROTOBUF_CONSTEXPR CheckinDefaultTypeInternal()
      : _instance(::_pbi::ConstantInitialized{}) {}
  ~CheckinDefaultTypeInternal() {}
  union {
    Checkin _instance;
  };
};
PROTOBUF_ATTRIBUTE_NO_DESTROY PROTOBUF_CONSTINIT PROTOBUF_ATTRIBUTE_INIT_PRIORITY1 CheckinDefaultTypeInternal _Checkin_default_instance_;
}  // namespace CheckinMsg
}  // namespace Schemas
}  // namespace IoTFleetWise
}  // namespace Aws
static ::_pb::Metadata file_level_metadata_checkin_2eproto[1];
static constexpr ::_pb::EnumDescriptor const** file_level_enum_descriptors_checkin_2eproto = nullptr;
static constexpr ::_pb::ServiceDescriptor const** file_level_service_descriptors_checkin_2eproto = nullptr;

const uint32_t TableStruct_checkin_2eproto::offsets[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) = {
  ~0u,  // no _has_bits_
  PROTOBUF_FIELD_OFFSET(::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin, _internal_metadata_),
  ~0u,  // no _extensions_
  ~0u,  // no _oneof_case_
  ~0u,  // no _weak_field_map_
  ~0u,  // no _inlined_string_donated_
  PROTOBUF_FIELD_OFFSET(::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin, _impl_.document_sync_ids_),
  PROTOBUF_FIELD_OFFSET(::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin, _impl_.timestamp_ms_epoch_),
};
static const ::_pbi::MigrationSchema schemas[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) = {
  { 0, -1, -1, sizeof(::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin)},
};

static const ::_pb::Message* const file_default_instances[] = {
  &::Aws::IoTFleetWise::Schemas::CheckinMsg::_Checkin_default_instance_._instance,
};

const char descriptor_table_protodef_checkin_2eproto[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) =
  "\n\rcheckin.proto\022#Aws.IoTFleetWise.Schema"
  "s.CheckinMsg\"@\n\007Checkin\022\031\n\021document_sync"
  "_ids\030\001 \003(\t\022\032\n\022timestamp_ms_epoch\030\002 \001(\004B$"
  "\n\"com.amazonaws.iot.autobahn.schemasb\006pr"
  "oto3"
  ;
static ::_pbi::once_flag descriptor_table_checkin_2eproto_once;
const ::_pbi::DescriptorTable descriptor_table_checkin_2eproto = {
    false, false, 164, descriptor_table_protodef_checkin_2eproto,
    "checkin.proto",
    &descriptor_table_checkin_2eproto_once, nullptr, 0, 1,
    schemas, file_default_instances, TableStruct_checkin_2eproto::offsets,
    file_level_metadata_checkin_2eproto, file_level_enum_descriptors_checkin_2eproto,
    file_level_service_descriptors_checkin_2eproto,
};
PROTOBUF_ATTRIBUTE_WEAK const ::_pbi::DescriptorTable* descriptor_table_checkin_2eproto_getter() {
  return &descriptor_table_checkin_2eproto;
}

// Force running AddDescriptors() at dynamic initialization time.
PROTOBUF_ATTRIBUTE_INIT_PRIORITY2 static ::_pbi::AddDescriptorsRunner dynamic_init_dummy_checkin_2eproto(&descriptor_table_checkin_2eproto);
namespace Aws {
namespace IoTFleetWise {
namespace Schemas {
namespace CheckinMsg {

// ===================================================================

class Checkin::_Internal {
 public:
};

Checkin::Checkin(::PROTOBUF_NAMESPACE_ID::Arena* arena,
                         bool is_message_owned)
  : ::PROTOBUF_NAMESPACE_ID::Message(arena, is_message_owned) {
  SharedCtor(arena, is_message_owned);
  // @@protoc_insertion_point(arena_constructor:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
}
Checkin::Checkin(const Checkin& from)
  : ::PROTOBUF_NAMESPACE_ID::Message() {
  Checkin* const _this = this; (void)_this;
  new (&_impl_) Impl_{
      decltype(_impl_.document_sync_ids_){from._impl_.document_sync_ids_}
    , decltype(_impl_.timestamp_ms_epoch_){}
    , /*decltype(_impl_._cached_size_)*/{}};

  _internal_metadata_.MergeFrom<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(from._internal_metadata_);
  _this->_impl_.timestamp_ms_epoch_ = from._impl_.timestamp_ms_epoch_;
  // @@protoc_insertion_point(copy_constructor:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
}

inline void Checkin::SharedCtor(
    ::_pb::Arena* arena, bool is_message_owned) {
  (void)arena;
  (void)is_message_owned;
  new (&_impl_) Impl_{
      decltype(_impl_.document_sync_ids_){arena}
    , decltype(_impl_.timestamp_ms_epoch_){uint64_t{0u}}
    , /*decltype(_impl_._cached_size_)*/{}
  };
}

Checkin::~Checkin() {
  // @@protoc_insertion_point(destructor:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  if (auto *arena = _internal_metadata_.DeleteReturnArena<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>()) {
  (void)arena;
    return;
  }
  SharedDtor();
}

inline void Checkin::SharedDtor() {
  GOOGLE_DCHECK(GetArenaForAllocation() == nullptr);
  _impl_.document_sync_ids_.~RepeatedPtrField();
}

void Checkin::SetCachedSize(int size) const {
  _impl_._cached_size_.Set(size);
}

void Checkin::Clear() {
// @@protoc_insertion_point(message_clear_start:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  uint32_t cached_has_bits = 0;
  // Prevent compiler warnings about cached_has_bits being unused
  (void) cached_has_bits;

  _impl_.document_sync_ids_.Clear();
  _impl_.timestamp_ms_epoch_ = uint64_t{0u};
  _internal_metadata_.Clear<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>();
}

const char* Checkin::_InternalParse(const char* ptr, ::_pbi::ParseContext* ctx) {
#define CHK_(x) if (PROTOBUF_PREDICT_FALSE(!(x))) goto failure
  while (!ctx->Done(&ptr)) {
    uint32_t tag;
    ptr = ::_pbi::ReadTag(ptr, &tag);
    switch (tag >> 3) {
      // repeated string document_sync_ids = 1;
      case 1:
        if (PROTOBUF_PREDICT_TRUE(static_cast<uint8_t>(tag) == 10)) {
          ptr -= 1;
          do {
            ptr += 1;
            auto str = _internal_add_document_sync_ids();
            ptr = ::_pbi::InlineGreedyStringParser(str, ptr, ctx);
            CHK_(ptr);
            CHK_(::_pbi::VerifyUTF8(str, "Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin.document_sync_ids"));
            if (!ctx->DataAvailable(ptr)) break;
          } while (::PROTOBUF_NAMESPACE_ID::internal::ExpectTag<10>(ptr));
        } else
          goto handle_unusual;
        continue;
      // uint64 timestamp_ms_epoch = 2;
      case 2:
        if (PROTOBUF_PREDICT_TRUE(static_cast<uint8_t>(tag) == 16)) {
          _impl_.timestamp_ms_epoch_ = ::PROTOBUF_NAMESPACE_ID::internal::ReadVarint64(&ptr);
          CHK_(ptr);
        } else
          goto handle_unusual;
        continue;
      default:
        goto handle_unusual;
    }  // switch
  handle_unusual:
    if ((tag == 0) || ((tag & 7) == 4)) {
      CHK_(ptr);
      ctx->SetLastTag(tag);
      goto message_done;
    }
    ptr = UnknownFieldParse(
        tag,
        _internal_metadata_.mutable_unknown_fields<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(),
        ptr, ctx);
    CHK_(ptr != nullptr);
  }  // while
message_done:
  return ptr;
failure:
  ptr = nullptr;
  goto message_done;
#undef CHK_
}

uint8_t* Checkin::_InternalSerialize(
    uint8_t* target, ::PROTOBUF_NAMESPACE_ID::io::EpsCopyOutputStream* stream) const {
  // @@protoc_insertion_point(serialize_to_array_start:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  uint32_t cached_has_bits = 0;
  (void) cached_has_bits;

  // repeated string document_sync_ids = 1;
  for (int i = 0, n = this->_internal_document_sync_ids_size(); i < n; i++) {
    const auto& s = this->_internal_document_sync_ids(i);
    ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::VerifyUtf8String(
      s.data(), static_cast<int>(s.length()),
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::SERIALIZE,
      "Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin.document_sync_ids");
    target = stream->WriteString(1, s, target);
  }

  // uint64 timestamp_ms_epoch = 2;
  if (this->_internal_timestamp_ms_epoch() != 0) {
    target = stream->EnsureSpace(target);
    target = ::_pbi::WireFormatLite::WriteUInt64ToArray(2, this->_internal_timestamp_ms_epoch(), target);
  }

  if (PROTOBUF_PREDICT_FALSE(_internal_metadata_.have_unknown_fields())) {
    target = ::_pbi::WireFormat::InternalSerializeUnknownFieldsToArray(
        _internal_metadata_.unknown_fields<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(::PROTOBUF_NAMESPACE_ID::UnknownFieldSet::default_instance), target, stream);
  }
  // @@protoc_insertion_point(serialize_to_array_end:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  return target;
}

size_t Checkin::ByteSizeLong() const {
// @@protoc_insertion_point(message_byte_size_start:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  size_t total_size = 0;

  uint32_t cached_has_bits = 0;
  // Prevent compiler warnings about cached_has_bits being unused
  (void) cached_has_bits;

  // repeated string document_sync_ids = 1;
  total_size += 1 *
      ::PROTOBUF_NAMESPACE_ID::internal::FromIntSize(_impl_.document_sync_ids_.size());
  for (int i = 0, n = _impl_.document_sync_ids_.size(); i < n; i++) {
    total_size += ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::StringSize(
      _impl_.document_sync_ids_.Get(i));
  }

  // uint64 timestamp_ms_epoch = 2;
  if (this->_internal_timestamp_ms_epoch() != 0) {
    total_size += ::_pbi::WireFormatLite::UInt64SizePlusOne(this->_internal_timestamp_ms_epoch());
  }

  return MaybeComputeUnknownFieldsSize(total_size, &_impl_._cached_size_);
}

const ::PROTOBUF_NAMESPACE_ID::Message::ClassData Checkin::_class_data_ = {
    ::PROTOBUF_NAMESPACE_ID::Message::CopyWithSourceCheck,
    Checkin::MergeImpl
};
const ::PROTOBUF_NAMESPACE_ID::Message::ClassData*Checkin::GetClassData() const { return &_class_data_; }


void Checkin::MergeImpl(::PROTOBUF_NAMESPACE_ID::Message& to_msg, const ::PROTOBUF_NAMESPACE_ID::Message& from_msg) {
  auto* const _this = static_cast<Checkin*>(&to_msg);
  auto& from = static_cast<const Checkin&>(from_msg);
  // @@protoc_insertion_point(class_specific_merge_from_start:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  GOOGLE_DCHECK_NE(&from, _this);
  uint32_t cached_has_bits = 0;
  (void) cached_has_bits;

  _this->_impl_.document_sync_ids_.MergeFrom(from._impl_.document_sync_ids_);
  if (from._internal_timestamp_ms_epoch() != 0) {
    _this->_internal_set_timestamp_ms_epoch(from._internal_timestamp_ms_epoch());
  }
  _this->_internal_metadata_.MergeFrom<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(from._internal_metadata_);
}

void Checkin::CopyFrom(const Checkin& from) {
// @@protoc_insertion_point(class_specific_copy_from_start:Aws.IoTFleetWise.Schemas.CheckinMsg.Checkin)
  if (&from == this) return;
  Clear();
  MergeFrom(from);
}

bool Checkin::IsInitialized() const {
  return true;
}

void Checkin::InternalSwap(Checkin* other) {
  using std::swap;
  _internal_metadata_.InternalSwap(&other->_internal_metadata_);
  _impl_.document_sync_ids_.InternalSwap(&other->_impl_.document_sync_ids_);
  swap(_impl_.timestamp_ms_epoch_, other->_impl_.timestamp_ms_epoch_);
}

::PROTOBUF_NAMESPACE_ID::Metadata Checkin::GetMetadata() const {
  return ::_pbi::AssignDescriptors(
      &descriptor_table_checkin_2eproto_getter, &descriptor_table_checkin_2eproto_once,
      file_level_metadata_checkin_2eproto[0]);
}

// @@protoc_insertion_point(namespace_scope)
}  // namespace CheckinMsg
}  // namespace Schemas
}  // namespace IoTFleetWise
}  // namespace Aws
PROTOBUF_NAMESPACE_OPEN
template<> PROTOBUF_NOINLINE ::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin*
Arena::CreateMaybeMessage< ::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin >(Arena* arena) {
  return Arena::CreateMessageInternal< ::Aws::IoTFleetWise::Schemas::CheckinMsg::Checkin >(arena);
}
PROTOBUF_NAMESPACE_CLOSE

// @@protoc_insertion_point(global_scope)
#include <google/protobuf/port_undef.inc>
